import { MainHeader } from "../components/MainHeader";
import { Aside } from "../components/Aside";

export default function Dashboard() {
  return (
    <>
      <MainHeader />
      <div className='flex flex-row'>
        <Aside />
      </div>
    </>
  );
}
