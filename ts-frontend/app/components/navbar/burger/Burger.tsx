export interface BurgerProps {
  item: {
    isOpen: boolean;
    onclick: () => void;
    styles: {
      burger: string;
      active: string;
    };
  };
}

const Burger: React.FC<BurgerProps> = ({ item }) => {
  const burgerClass = item.styles.burger;
  const isOpen = item.isOpen;
  return (
    <button 
      onClick={item.onclick}
      className={`flex justify-center items-center ${burgerClass} ${isOpen ? item.styles.active : ""}`}
      >
    </button>
  );
}

export default Burger;