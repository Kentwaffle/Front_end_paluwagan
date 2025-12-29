import React, { useRef, useImperativeHandle, forwardRef } from "react";

const TermsModal = forwardRef((props, ref) => {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    },
  }));

  return (
    <dialog id="terms_modal" className="modal" ref={dialogRef}>
      <div className="modal-box max-w-lg">
        <h3 className="text-xl font-bold">Paluwagan Terms and Conditions</h3>

        <div className="py-4 max-h-80 overflow-y-auto text-sm text-gray-700 space-y-3">
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
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-primary">Naiintindihan Ko</button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

export default TermsModal;
