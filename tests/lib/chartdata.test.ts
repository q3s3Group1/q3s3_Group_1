import { fetchChartData } from '@/lib/supabase/fetchMachineTimelines';
import { IntervalType } from '@/types/enum';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define test cases with start and end dates
const testCases = [
    {
      "board": 1,
      "port": 35,
      "startDate": "2020-09-28",
      "endDate": "2020-10-14",
      "interval": IntervalType.Day,
      "difference": 17
    },
    {
      "board": 2,
      "port": 42,
      "startDate": "2021-01-01",
      "endDate": "2021-01-10",
      "interval": IntervalType.Day,
      "difference": 10
    },
    {
      "board": 3,
      "port": 50,
      "startDate": "2022-06-01",
      "endDate": "2022-06-07",
      "interval": IntervalType.Day,
      "difference": 7
    },
  ];

describe('fetchChartData', () => {
  test.each(testCases)(
    'should return the correct amount of data for board $board, port $port, and interval $interval',
    async ({ board, port, startDate, endDate, interval, difference }) => {
     const startDated = new Date(startDate);
      const endDated = new Date(endDate);
      // Fetch the chart data
      const response = await fetchChartData(board, port, startDated, endDated, interval);

      // Assert that the response length matches the expected day difference
      expect(response).toHaveLength(difference);

      // Assert that the response is an array
      expect(Array.isArray(response)).toBe(true);

    }
  );
});
