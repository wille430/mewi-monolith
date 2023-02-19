import AccountDetails from "@/components/AccountDetails/AccountDetails";
import { HorizontalLine } from "@/components/HorizontalLine/HorizontalLine";
import { getUser } from "../getUser";

export const metadata = {
  title: "Mitt Koto",
};

const Konto = async () => {
  const user = await getUser();
  return (
    <main>
      <section
        style={{
          minHeight: "50vh",
        }}
      >
        <div>
          <h3>Mitt Konto</h3>
          <HorizontalLine />
        </div>

        <div>
          <AccountDetails user={user!} />
        </div>
      </section>
    </main>
  );
};

export default Konto;
