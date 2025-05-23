interface CheckboxProps {
    item: {
        label: {
            htmlFor: string;
            text: string;
            name: string;
        }
        input: {
            id: string;
            name: string;
            checked: boolean;
        }
        isChecked: boolean;
        onChange: (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>) => void;
    }
}

const Checkbox: React.FC<CheckboxProps> = ({ item }) => {

    const checkClass = item.isChecked ? 'checked' : '';
    
    return (
        <div className={`flex items-center cursor-pointer gap-x-2 text-ellipsis`}>
            <input 
                id={item.input.name}
                className={`hidden`}
                type="checkbox"
                checked={item.isChecked}
                name={item.input.name}
                value={item.input.name?.toLowerCase() ? item.input.name.toLowerCase() : ''}
                onChange={item.onChange}
            />
            <div 
                className={`custom-checkbox ${checkClass}`} 
                onClick={item.onChange}
            >
            </div>
            <label htmlFor={item.label.name} className={`no-scrollbar cursor-pointer font-medium`}>
                {item.label.text}
            </label>
        </div>
    )
}

export default Checkbox;