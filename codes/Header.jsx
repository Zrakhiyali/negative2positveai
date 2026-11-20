
import { Bell, Search, Sparkles } from "lucide-react";

function Header() {
  return (
    <header className="header">

      <div>
        <h2>Image Restoration Studio</h2>
        <p>Restore your memories with image processing.</p>
      </div>

      <div className="header-actions">

        <div className="search-box">
          <Search size={17} />
          <input placeholder="Search..." />
        </div>

        <button className="icon-button">
          <Bell size={19} />
        </button>

        <button className="upgrade-button">
          <Sparkles size={17} />
          Pro Studio
        </button>

      </div>

    </header>
  );
}

export default Header;
