
import LoginButton from "@workspace/ui/components/LoginButton";
import UserImageButton from "@workspace/ui/components/UserImageButton";

const Appbar: React.FC = () => {

  return (
    <div className="h-16 backdrop-blur-100 text-white flex items-center justify-end px-4 z-10">
      <UserImageButton />
      <LoginButton />
    </div>
  );
};
export default Appbar;
