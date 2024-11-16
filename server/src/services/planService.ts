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
        const [plans]: [any, any] = await pool.query('SELECT * FROM plan WHERE plan_id = ?', [planId]);
        const [flights]: [any, any] = await pool.query('SELECT * FROM plan_flight WHERE plan_id = ?', [planId]);
        const [airbnbs]: [any, any] = await pool.query('SELECT * FROM plan_airbnb WHERE plan_id = ?', [planId]);

        const flightSegments: Segment[] = flights.map((flight: any) => {
            const { flight_id, ...rest } = flight;
            return {
                ...rest,
                segment_id: String(flight_id),
                segment_type: SegmentTypeEnum.FLIGHT,
            };
        });

        const airbnbSegments: Segment[] = airbnbs.map((airbnb: any) => {
            const { airbnb_id, ...rest } = airbnb;
            return {
                ...rest,
                segment_id: String(airbnb_id),
                segment_type: SegmentTypeEnum.AIRBNB,
            };
        });

        const segments: Segment[] = [...flightSegments, ...airbnbSegments].sort((a, b) => {
            if (a.ordinal && b.ordinal) {
                return a.ordinal - b.ordinal;
            }
            return 0;
        });

        plans[0].segments = segments;
        return plans[0] as Plan;

    } catch (error) {
        throw error;
    }
}