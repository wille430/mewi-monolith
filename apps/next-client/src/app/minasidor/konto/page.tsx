import AccountDetails from "@/components/AccountDetails/AccountDetails";
import { HorizontalLine } from "@/components/HorizontalLine/HorizontalLine";
import { getUser } from "../getUser";
import { LoginStrategy } from "@mewi/models";
import capitalize from "lodash/capitalize";

export const metadata = {
  title: "Mitt Konto",
};

const Konto = async () => {
  const user = (await getUser())!;
  return (
    <main>
      <section
        className="card"
        style={{
          minHeight: "50vh",
        }}
      >
        <h3>Mitt Konto</h3>
        <HorizontalLine />

        {user.loginStrategy === LoginStrategy.LOCAL ? (
          <AccountDetails user={user} />
        ) : (
          <p className="text-sm text-muted">
            Du har loggat in med {capitalize(user.loginStrategy)}. För att hantera ditt
            konto, var vänlig hänvisa till deras hemsida.
          </p>
        )}
      </section>
    </main>
  );
};

export default Konto;
