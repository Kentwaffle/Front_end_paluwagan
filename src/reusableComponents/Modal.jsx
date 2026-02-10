import React from "react";

const Modal = ({ id, title, children, actionButton }) => {
  return (
    <dialog id={id} className="modal modal-center sm:modal-middle">
      <div className="modal-box bg-white">
        {title && <h3 className="font-bold text-xl text-slate-800">{title}</h3>}

        {children && <div className="py-2">{children}</div>}

        <div className="modal-action ">
          <form method="dialog" className="flex gap-2">
            <button className="btn bg-red-400">Close</button>
            {actionButton}
          </form>
        </div>
      </div>
      {/* <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form> */}
    </dialog>
  );
};

export default Modal;
