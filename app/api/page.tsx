import {ApiReferenceReact} from "@scalar/api-reference-react";
import './custom.css';

export default function Page() {
  return <div style={{
    height: '500px'
  }}>
    <ApiReferenceReact
      configuration={{
        baseServerURL: 'https://api.rixl.com',
        url: '/api.yaml',
        theme: 'default',
        darkMode: false,
        hideClientButton: true,
        documentDownloadType: "yaml",
        hideDarkModeToggle: true,
      }}
    />
  </div>;
}