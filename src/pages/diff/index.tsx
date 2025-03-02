import React, { PureComponent, Fragment, useState, useEffect } from 'react';
import { Button, message, Modal } from 'antd';
import config from '@/utils/config';
import { PageContainer } from '@ant-design/pro-layout';
import { request } from '@/utils/http';
import './index.less';
import { DiffEditor } from '@monaco-editor/react';
import ReactDiffViewer from 'react-diff-viewer';
import { useCtx, useTheme } from '@/utils/hooks';

const Crontab = () => {
  const [value, setValue] = useState('');
  const [sample, setSample] = useState('');
  const [loading, setLoading] = useState(true);
  const { headerStyle, isPhone } = useCtx();
  const { theme } = useTheme();

  const getConfig = () => {
    request.get(`${config.apiPrefix}configs/config.sh`).then((data) => {
      setValue(data.data);
    });
  };

  const getSample = () => {
    setLoading(true);
    request
      .get(`${config.apiPrefix}configs/config.sample.sh`)
      .then((data) => {
        setSample(data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getConfig();
    getSample();
  }, []);

  return (
    <PageContainer
      className="ql-container-wrapper"
      title="对比工具"
      loading={loading}
      header={{
        style: headerStyle,
      }}
    >
      {isPhone ? (
        <ReactDiffViewer
          styles={{
            diffContainer: {
              overflowX: 'auto',
              minWidth: 768,
            },
            diffRemoved: {
              overflowX: 'auto',
              maxWidth: 300,
            },
            diffAdded: {
              overflowX: 'auto',
              maxWidth: 300,
            },
            line: {
              wordBreak: 'break-word',
            },
          }}
          oldValue={value}
          newValue={sample}
          splitView={true}
          leftTitle="config.sh"
          rightTitle="config.sample.sh"
          disableWordDiff={true}
        />
      ) : (
        <DiffEditor
          language={'shell'}
          original={sample}
          modified={value}
          options={{
            readOnly: true,
            fontSize: 12,
            lineNumbersMinChars: 3,
            folding: false,
            glyphMargin: false,
            wordWrap: 'on',
          }}
          theme={theme}
        />
      )}
    </PageContainer>
  );
};

export default Crontab;
