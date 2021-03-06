import gql from 'graphql-tag';
import { Article, Blog } from '../../graphql/graphql';

interface IBlogWithApollo {
  siteDomain: string
  authorName: string
}

export interface IBlogOfClient extends Blog, IBlogWithApollo {
}

interface IArticleWithApollo {
  polishedTitle: string
  polishedSummary: string
  blog: IBlogOfClient
}

export interface IArticleOfClient extends Omit<Article, "blog">, IArticleWithApollo {
}

export const ArticleMetadataFragment = gql`
    fragment ArticleMetadata on Article {
        id
        title
        slug
        polishedTitle @client
        date
        blog {
            author
            site
            stableSite
            siteDomain @client
            authorName @client
        }
    }
`;

export const LIST_ARTICLES = gql`
    query Articles($page: Int! = 1, $size: Int! = 10) {
        articles(page: $page, size: $size) {
            articles {
                ...ArticleMetadata
                tags
            }
            pageInfo {
                hasMore
            }
        }
    }
    ${ArticleMetadataFragment}
`;

export const RETRIEVE_ARTICLE_BY_SLUG = gql`
    query ArticleById($slug: String!) {
        articleBySlug(slug: $slug) {
            ...ArticleMetadata
            url
            summary(length: 99999)
            polishedSummary @client
            content
        }
    }
    ${ArticleMetadataFragment}
`;

export const LiST_ARTICLES_BY_BLOG = gql`
    query ArticlesByBlog($stableSite: String!) {
        articlesByBlog(stableSite: $stableSite) {
            blog {
                site
                author
                siteName
                stableSite
                siteDomain @client
                authorName @client
            }
            articles {
                id
                title
                polishedTitle @client
                slug
                date
            }

        }
    }
`;
