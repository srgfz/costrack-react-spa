import { Waveform } from "@uiball/loaders";
const Spinner = () => {
  return (
    <div className="min-vh-100 mx-auto d-flex justify-content-center align-items-center">
      <Waveform size={40} lineWeight={3.5} speed={1} color="black" />
    </div>
  );
};

export default Spinner;
