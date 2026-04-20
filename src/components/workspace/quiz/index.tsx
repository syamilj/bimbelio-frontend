// index.tsx

import { usePathname } from 'next/navigation';
import IndividualQuiz from './_component/individual-quiz';
import Start from './_component/start';
import Provider, { useProvider } from './provider';

const Quiz = () => {
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const documentId = `${
    pathnameArray && pathnameArray[pathnameArray?.length - 1]
  }`;
  return (
    <Provider documentId={documentId}>
      <Main />
    </Provider>
  );
};

const Main = () => {
  const {
    useQuiz: { Quiz: quiz },
    useState: { current: cur },
  } = useProvider();

  return (
    <div className="h-full pt-[.5rem]">
      {quiz.length === 0 && <Start />}

      {quiz.length > 0 &&
        cur >= 0 &&
        cur < quiz.length &&
        quiz[cur] !== undefined && <IndividualQuiz />}
    </div>
  );
};
export default Quiz;
