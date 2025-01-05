import { fetchChartData } from '@/lib/supabase/fetchMachineTimelines';
import { IntervalType } from '@/types/enum';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Define test cases with start and end dates
const testCases = [
  {
    board: 1,
    port: 35,
    startDate: new Date(2020, 8, 28), // September 28, 2020
    endDate: new Date(2020, 9, 14),   // October 14, 2020
    interval: IntervalType.Day
  },
  {
    board: 2,
    port: 42,
    startDate: new Date(2021, 0, 1),  // January 1, 2021
    endDate: new Date(2021, 0, 10),   // January 10, 2021
    interval: IntervalType.Day
  },
  {
    board: 3,
    port: 50,
    startDate: new Date(2022, 5, 1),  // June 1, 2022
    endDate: new Date(2022, 5, 7),    // June 7, 2022
    interval: IntervalType.Day
  }
];

describe('fetchChartData', () => {
  test.each(testCases)(
    'should return the correct amount of data for board $board, port $port, and interval $interval',
    async ({ board, port, startDate, endDate, interval }) => {
      // Calculate the difference in days between startDate and endDate
      const difference = Math.abs(startDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

      // Fetch the chart data
      const response = await fetchChartData(board, port, startDate, endDate, interval);

      // Assert that the response length matches the expected day difference
      expect(response).toHaveLength(difference);
    }
  );
});
