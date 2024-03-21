import { ChevronLeft, ChevronRight } from "lucide-react";

function HeaderAlerts() {
  return (
    <div className="flex items-center justify-center">
      <button>
        <ChevronLeft width={16} />
      </button>
      {/* alert */}
      <div>Get 10% off on business sign up</div>
      <button>
        <ChevronRight width={16} />
      </button>
    </div>
  );
}

export default HeaderAlerts;
