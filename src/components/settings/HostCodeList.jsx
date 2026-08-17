function HostCodeList({ hostnames, separator = ' Or ' }) {
  return hostnames.map((host, index) => (
    <span key={host}>
      {index > 0 ? separator : ''}
      <code>{host}</code>
    </span>
  ));
}

export default HostCodeList;
