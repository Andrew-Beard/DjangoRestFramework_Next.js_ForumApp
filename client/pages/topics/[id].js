import React from 'react'
import Link from 'next/link'

import client from '../../utils/client'

import Post from '../../components/posts/Post'

const TopicPage = ({ topic, initialPosts }) => {
  const [posts, setPosts] = React.useState(initialPosts)

  const replacePost = newPost => {
    const newPosts = posts.map(post => {
      if (post.id === newPost.id) {
        return newPost
      }
      return post
    })
    setPosts(newPosts)
  }

  if (!topic.id) {
    return (
      <div className="text-center">
        <h1>Unable to find topic</h1>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-center">{topic.title}</h1>
      <p className="text-center">
        <small>
          Created by: {topic.author.username} on{' '}
          {new Date(topic.created_at).toLocaleDateString()}
        </small>
      </p>

      <div className="card shadow">
        <div className="card-body">
          {posts.length === 0 ? (
            <h2>There are no posts yet.</h2>
          ) : (
            posts.map(post => (
              <div key={post.id}>
                <Post post={post} replacePost={replacePost} />
                <hr />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

TopicPage.getInitialProps = async ctx => {
  try {
    const topicPromise = client.get(`/api/topics/${ctx.ctx.query.id}/`)
    const postsPromise = client.get(`/api/topics/${ctx.ctx.query.id}/posts/`)

    const topicRes = await topicPromise
    const postsRes = await postsPromise

    return {
      topic: topicRes.data.topic,
      initialPosts: postsRes.data.posts,
    }
  } catch (e) {
    return {
      topic: {},
      initialPosts: [],
    }
  }
}

export default TopicPage
