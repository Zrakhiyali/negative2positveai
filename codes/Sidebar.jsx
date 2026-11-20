
import {
  Image,
  LayoutDashboard,
  History,
  Settings,
  HelpCircle,
  Film
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <Film size={28} />
        <span>FilmRestore</span>
      </div>

      <div className="menu-title">WORKSPACE</div>

      <nav>
        <a className="menu-item active">
          <LayoutDashboard size={19} />
          Dashboard
        </a>

        <a className="menu-item">
          <Image size={19} />
          Image Restoration
        </a>

        <a className="menu-item">
          <History size={19} />
          History
        </a>
      </nav>

      <div className="menu-title">PREFERENCES</div>

      <nav>
        <a className="menu-item">
          <Settings size={19} />
          Settings
        </a>

        <a className="menu-item">
          <HelpCircle size={19} />
          Help Center
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">F</div>
        <div>
          <strong>FilmRestore AI</strong>
          <small>Image Restoration Studio</small>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;
