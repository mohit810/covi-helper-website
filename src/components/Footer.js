import {memo} from 'react';
import {Twitter, GitHub, Database, Mail, Send} from 'react-feather';
import {useTranslation} from 'react-i18next';

function Footer() {
  const {t} = useTranslation();

  return (
    <footer className="flex flex-col flex-wrap pt-2 pb-5">
      <div className="flex-1 mb-1.5">
        <a
            className="text-2xl py-1 px-2 rounded-xl text-green-600 bg-green-100"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Covid-Helper
        </a>
      </div>

      <div className="flex-1 mb-2.5">
        <a
            className="text-2xl py-1 px-2 "
            href=""
            target="_blank"
            rel="noopener noreferrer"
        >
          Let's help each other in this pandemic
        </a>
      </div>

      {/*<h5>{t('We stand with everyone fighting on the frontlines')}</h5>*/}

      <div className="flex-1 flex flex-wrap">
        <a
          href=""
          className="github mx-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub />
        </a>

        <a
          className="api mx-2"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <Database />
        </a>

        <a
          href=""
          className="telegram mx-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Send />
        </a>

        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="twitter mx-2"
        >
          <Twitter />
        </a>

        <a
          href="mailto:"
          className="mail mx-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Mail />
        </a>
      </div>
    </footer>
  );
}

export default memo(Footer);
