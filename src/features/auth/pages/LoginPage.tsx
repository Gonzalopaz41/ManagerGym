import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <main className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
      <div className="w-full max-w-[380px] flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">ManagerGym</h1>
          <p className="mt-2 text-[13px] text-[#888888]">
            Iniciá sesión para continuar
          </p>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-[8px] p-5">
          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
