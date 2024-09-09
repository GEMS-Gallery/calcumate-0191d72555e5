export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Float64, 'err' : IDL.Text });
  return IDL.Service({
    'calculate' : IDL.Func([IDL.Float64, IDL.Float64, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
