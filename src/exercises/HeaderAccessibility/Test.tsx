import HeaderProvider, { useCurrentHeader } from "./HeaderProvider";

function RecursiveConsumer() {
  const Tag = useCurrentHeader();

  return (
    <>
      <Tag>The current header is {Tag}</Tag>

      {Tag !== "h6" && (
        <HeaderProvider>
          <RecursiveConsumer />
        </HeaderProvider>
      )}
    </>
  );
}

export default function Test() {
  return (
    <HeaderProvider>
      <RecursiveConsumer />
    </HeaderProvider>
  );
}
