import { ChevronLeft, ChevronRight } from "lucide-react";

function HeaderAlerts() {
  return (
    <div className="flex justify-center space-x-6 bg-neutral-100 pt-2 text-sm">
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
