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

export const colorTooltip = {
  ...baseTooltip,
  trigger: 'item',
  formatter: colorFormatter
};
