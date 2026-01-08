import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";

const TermsModal = forwardRef(({ onAccept }, ref) => {
  const dialogRef = useRef(null);
  const scrollRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(true);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    },
  }));
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setIsDisabled(false);
      }
    }
  };

  return (
    <dialog id="terms_modal" className="modal" ref={dialogRef}>
      <div className="modal-box max-w-lg">
        <h3 className="pb-5 text-3xl text-center font-bold">
          Paluwagan Terms and Conditions
        </h3>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="py-4 p-3 max-h-80 overflow-y-auto text-sm text-gray-700 space-y-3 bg-stone-100 rounded"
        >
          <p>
            **1. Layunin:** Ang Paluwagan ay para lamang sa lehitimong miyembro.
            Bawal ang double-entry.
          </p>
          <p>
            **2. Kontribusyon:** Kailangang bayaran ang kontribusyon sa takdang
            oras. Ang late payment ay may multa.
          </p>
          <p>
            **3. Iba Pa:** Lahat ng decision ng Paluwagan administrator ay
            pinal.
          </p>
          <p>
            **3. Iba Pa:** Lahat ng decision ng Paluwagan administrator ay
            pinal.
          </p>
          <p>
            **3. Iba Pa:** Lahat ng decision ng Paluwagan administrator ay
            pinal.
          </p>
          <p>
            **3. Iba Pa:** Lahat ng decision ng Paluwagan administrator ay
            pinal.
          </p>
          <p>
            **3. Iba Pa:** Lahat ng decision ng Paluwagan administrator ay
            pinal.
          </p>
          <p>
            **3. Iba Pa:** Lahat ng decision ng Paluwagan administrator ay
            pinal.
          </p>
          <p>
            **3. Iba Pa:** Lahat ng decision ng Paluwagan administrator ay
            pinal.
          </p>
          <p>
            **3. Iba Pa:** Lahat ng decision ng Paluwagan administrator ay
            pinal.
          </p>
          <p>
            **3. Iba Pa:** Lahat ng decision ng Paluwagan administrator ay
            pinal.
          </p>
        </div>

        <span className="block text-sky-400 text-sm text-center italic mt-3">
          Mangyaring basahin ang detalye sa ibaba para ma-click ang button.
          <span className="text-red-500">*</span>
        </span>

        <div className="modal-action">
          <form method="dialog" className="w-full flex justify-between gap-4">
            <button
              type="submit"
              onClick={onAccept}
              disabled={isDisabled}
              className={`btn flex-1 ${
                isDisabled ? "btn-disabled" : "bg-sky-500 text-white"
              }`}
            >
              I understand
            </button>
            <button className="btn bg-red-400 text-white flex-1">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

export default TermsModal;
