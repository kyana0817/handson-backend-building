export default function Modal({open, handleClose, children}) {

  const onClick = (e) => {
    if (e.currentTarget === e.target) {
      handleClose()
    }
  }

  return (
    <div className={`modal-wrap${open? ' active': ''}`} onClick={onClick}>
      {open && children}
    </div>
  )
}
