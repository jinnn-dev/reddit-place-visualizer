import { parse } from 'papaparse';

export type ParsedStatsLine = {
  [key: string]: any;
};

export function parseActivityStatistic(completeCallback: (result: Array<ParsedStatsLine>) => void) {
  parse('https://pdyn.de/place/place_activity_stats.csv', {
    download: true,
    delimiter: ';',
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      completeCallback(results.data as Array<ParsedStatsLine>);
    }
  });
}