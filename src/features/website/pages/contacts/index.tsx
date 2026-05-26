import { useTranslation } from "react-i18next";

import { useLocations } from "@/features/website/hooks/useLocations";
import { OfficeCard } from "@/features/website/pages/contacts/OfficeCard";
import { useLocalize } from "@/shared/hooks/useLocalize";

export const ContactsPage = () => {
  const { t } = useTranslation("website");
  const { locations } = useLocations();
  const localize = useLocalize();

  const city = locations[0]
    ? localize(locations[0].cityRu, locations[0].cityUa)
    : "";

  return (
    <section
      className="ws-section ws-contacts-section"
      aria-labelledby="contacts-heading"
    >
      <div className="ws-wrap">
        <header className="mb-8">
          <p className="ws-section-eyebrow">{t("contacts.eyebrow")}</p>
          <h1 id="contacts-heading" className="ws-section-title">
            {t("contacts.titlePrefix")}{" "}
            <strong>
              {t("contacts.cityAbbr")} {city}.
            </strong>
          </h1>
        </header>
        {locations.map((location, index) => (
          <OfficeCard key={location.id} location={location} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ContactsPage;
