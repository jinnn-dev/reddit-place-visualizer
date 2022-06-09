const baseTooltip = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  borderWidth: 0,
  borderRadius: 10
};

const colorSpan = (color: string) =>
  '<span style="display:inline-block;margin-right:5px;outline: 2px solid gray;border-radius:10px;width:15px;height:15px;background-color:' +
  color +
  '"></span>';

const colorFormatter = (params: any) => {
  const item = params.data;
  return '<p style="color: white">' + colorSpan(item.name) + ' ' + item.name + ': ' + item.value + '</p>';
};

const activityFormatter = (params: any) => {
  let tooltip = '<p style="color: white; text-align: center; font-weight: bold">' + params[0].axisValue + '</p>';

  params.sort((a: any, b: any) => b.data - a.data);

  params.forEach((item: any) => {
    const itemRow =
      '<p style="color: white">' + colorSpan(item.seriesName) + ' ' + item.seriesName + ': ' + item.data + '</p>';
    tooltip += itemRow;
  });
  return tooltip;
};

export const colorTooltip = {
  ...baseTooltip,
  trigger: 'item',
  formatter: colorFormatter
};

export const activityTooltip = {
  ...baseTooltip,
  trigger: 'axis',
  position: 'right',
  confine: true,
  axisPointer: {
    type: 'cross',
    label: {
      backgroundColor: '#6a7985'
    }
  },
  formatter: activityFormatter
};
