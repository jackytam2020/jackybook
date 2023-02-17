import React from 'react';
import { useRouter } from 'next/router';

function Test() {
  const router = useRouter();
  return <div>{`sdflkgjkl${router.query.id}`}</div>;
}

export default Test;
