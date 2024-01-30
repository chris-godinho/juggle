// LayoutTable.jsx

import { useLayout } from "../contextproviders/LayoutProvider.jsx";
import { useDataContext } from "../contextproviders/DataContext";

export default function LayoutTable() {
  const { formData, setFormData } = useDataContext();

  const { changeLayout } = useLayout();

  const handleLayoutChange = (key) => {
    changeLayout(key);
    setFormData({
      ...formData,
      user: {
        ...formData.user,
        layoutSettings: {
          ...formData.user.layoutSettings,
          dashboardLayout: key,
        },
      },
    });
  };

  return (
    <div className="settings-layout-card-container-jg">
      <div className="settings-card-jg">
        <div className="settings-thumbnail-jg">
          <a href="#" onClick={() => handleLayoutChange("two-sidebars")}>
            <img
              src="/layouts/layout1.png"
              alt="Dual Sidebar Layout"
              className="settings-thumbnail-image-jg"
            />
          </a>
        </div>
        <p className="settings-thumbnail-label-jg">Two Sidebars</p>
      </div>
      <div className="settings-card-jg">
        <div className="settings-thumbnail-jg">
          <a href="#" onClick={() => handleLayoutChange("one-sidebar-left")}>
            <img
              src="/layouts/layout2.png"
              alt="Left Sidebar Layout"
              className="settings-thumbnail-image-jg"
            />
          </a>
        </div>
        <p className="settings-thumbnail-label-jg">One Sidebar (Left)</p>
      </div>
      <div className="settings-card-jg">
        <div className="settings-thumbnail-jg">
          <a href="#" onClick={() => handleLayoutChange("one-sidebar-right")}>
            <img
              src="/layouts/layout3.png"
              alt="Right Sidebar Layout"
              className="settings-thumbnail-image-jg"
            />
          </a>
        </div>
        <p className="settings-thumbnail-label-jg">One Sidebar (Right)</p>
      </div>
      <div className="settings-card-jg">
        <div className="settings-thumbnail-jg">
          <a href="#" onClick={() => handleLayoutChange("no-sidebars")}>
            <img
              src="/layouts/layout4.png"
              alt="No Sidebar Layout"
              className="settings-thumbnail-image-jg"
            />
          </a>
        </div>
        <p className="settings-thumbnail-label-jg">No Sidebars</p>
      </div>
    </div>
  );
}
