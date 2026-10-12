import {PopUpWindow, type PopUpWindowProps} from './PopUpWindow'

type PopUpProps = PopUpWindowProps & { onClose: () => void }

export function PopUp(props: PopUpProps) {
    return (
        <div className='fixed inset-0 z-50 flex-center'>
            <button
                type='button'
                aria-label='Закрыть'
                onClick={props.onClose}
                className='absolute inset-0 bg-black/50 cursor-default'
            />
            <PopUpWindow {...props}/>
        </div>
    )
}
