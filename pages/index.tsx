import React from 'react'
import { GetServerSideProps } from 'next'

import prisma from "../lib/prisma";
import { Post } from '@prisma/client';

type Props = {
  posts: Post[]
}

const Blog: React.FC<Props> = props => {
  return (
    <>
      {props.posts}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  })
  return {
    props: { posts },
  }
}

export default Blog
