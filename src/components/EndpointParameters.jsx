import EndpointParametersInput from "./EndpointParametersInput";

export default ({ params, paramsKeyValue, setParamsKeyValue, color, borderColor, translationHandler }) => {
  return (
    <table style={{ '--custom-bg-color': `${color}`, '--custom-border-color': `${borderColor}` }}
      className="bg-[var(--custom-bg-color)] border-[var(--custom-border-color)] border text-left w-full h-full rounded-lg overflow-hidden border-separate border-spacing-0">
      <tbody className="[&>*:nth-child(odd)]:bg-[#FFF] [&>*:nth-child(even)]:bg-[#f2f2f2]">
        <tr style={{ '--custom-bg-color': `${color}80` }} className="!bg-[var(--custom-bg-color)]">
          <th style={{ '--custom-border-color': `${borderColor}` }} className="border border-[var(--custom-border-color)]">{translationHandler("console.table.parameters")}</th>
          <th style={{ '--custom-border-color': `${borderColor}` }} className="border border-[var(--custom-border-color)] pl-2">{translationHandler("console.table.values")}</th>
        </tr>
        {
          params.map(p => {
            return (
              <EndpointParametersInput key={p.key} params={p.key} placeholder={p.placeholder} paramsKeyValue={paramsKeyValue} setParamsKeyValue={setParamsKeyValue} />
            )
          })
        }
      </tbody>
  </table>
    );
};