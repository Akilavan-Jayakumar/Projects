import Logo from "../../public/todo.svg";

const Header = () => {
  return (
    <div className="h-12 border-b border-gray-300 flex items-center space-x-1 text-indigo-600 px-4">
      <Logo className="h-8 w-8" />
      <p className="text-3xl font-bold flex-1">To-Do</p>
    </div>
  );
};

export default Header;
