import logoPtit from '../../assets/image/logo/logo_ptit.png';


const HeaderProblem= () => {
  return (
    <div className="h-12 bg-[rgb(240_240_240_/0.5)] flex items-center px-7 pt-3 pb-0 justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <img src={logoPtit} alt="LeetCode" className="h-6 pr-3 border-r-2" />
          <span className="font-medium"> Python basic</span>
        </div>
        <div className="flex items-center">
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <span className="text-sm">U</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderProblem;