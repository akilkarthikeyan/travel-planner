import { pool } from '../db';
import { Plan } from '../models/Plan';
import { Segment, SegmentTypeEnum } from '../models/Segment';

export async function getPlansByUserId(userId: number): Promise<Plan[]> {
    try {
        const [rows] = await pool.query('SELECT * FROM plan WHERE user_id = ?', [userId]);
        return rows as Plan[];
    } catch (error) {
        throw error;
    }
}

export async function getPlanById(planId: number): Promise<Plan> {
    try {
        const [rows] = await pool.query('SELECT * FROM plan WHERE plan_id = ?', [planId]);
        const plans = rows as Plan[];
        let plan: Plan | undefined = plans[0];
        const [flights]: [any, any] = await pool.query('SELECT * FROM plan_flight WHERE plan_id = ?', [planId]);
        const [airbnbs]: [any, any] = await pool.query('SELECT * FROM plan_airbnb WHERE plan_id = ?', [planId]);

        const flightSegments: Segment[] = flights.map((flight: any) => {
            const { flight_id, plan_id, ...rest } = flight;
            return {
                ...rest,
                segment_id: String(flight_id),
                segment_type: SegmentTypeEnum.FLIGHT,
            };
        });

        const airbnbSegments: Segment[] = airbnbs.map((airbnb: any) => {
            const { airbnb_id, plan_id, ...rest } = airbnb;
            return {
                ...rest,
                segment_id: String(airbnb_id),
                segment_type: SegmentTypeEnum.AIRBNB,
                start_date: rest.start_date.toISOString().slice(0, 10),
                end_date: rest.end_date.toISOString().slice(0, 10)
            };
        });

        const segments: Segment[] = [...flightSegments, ...airbnbSegments].sort((a, b) => {
            if (a.ordinal && b.ordinal) {
                return a.ordinal - b.ordinal;
            }
            return 0;
        });

        if (plan) {
            plan.segments = segments;
        }
        return plan;
    } catch (error) {
        throw error;
    }
}

export async function createPlan(plan: Plan, userId: number): Promise<Plan> {
    try {
        const { plan_name, plan_description, segments } = plan;
        const connection = await pool.getConnection();
        let planId: number;
        try {
            await connection.beginTransaction();

            const [result]: [any, any] = await connection.query('INSERT INTO plan (plan_name, plan_description, user_id) VALUES (?, ?, ?)', [plan_name, plan_description, userId]);
            planId = result.insertId;
            const flightSegments = segments.filter(segment => segment.segment_type === SegmentTypeEnum.FLIGHT);
            const airbnbSegments = segments.filter(segment => segment.segment_type === SegmentTypeEnum.AIRBNB);

            await Promise.all(flightSegments.map(async (segment: Segment) => {
            await connection.query('INSERT INTO plan_flight (plan_id, flight_id, ordinal) VALUES (?, ?, ?)', [planId, segment.segment_id, segment.ordinal]);
            }));

            await Promise.all(airbnbSegments.map(async (segment: Segment) => {
            await connection.query('INSERT INTO plan_airbnb (plan_id, airbnb_id, start_date, end_date, ordinal) VALUES (?, ?, ?, ?, ?)', [planId, Number(segment.segment_id), segment.start_date, segment.end_date, segment.ordinal]);
            }));

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

        return { plan_id: planId, ...plan};

    } catch (error) {
        throw error;
    }
}