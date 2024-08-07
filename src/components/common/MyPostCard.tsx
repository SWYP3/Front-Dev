"use client";
import { postLike } from "@/api/communityApi";
import { PostData } from "@/api/myPage";
import styles from "@/components/common/MyPostCard.module.scss";
import { formatYYYYMMDDTIME } from "@/util/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";
import { TREATMENT_LIST } from "@/constants/treatmentConstants";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

type PropsPost = {
  type: "post" | "comment" | "like";
  listData: PostData;
  refetch?: any;
};

const MyPostCard = ({ type, listData, refetch }: PropsPost) => {
  const [tagList, setTagList] = useState<string[]>([]);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState<boolean>(
    listData.likedByCurrentUser ?? true
  );
  const [likeCount, setLikeCount] = useState(listData.likeCount || 0);
  const [isImageError, setIsImageError] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isPostImageError, setIsPostImageError] = useState<{
    [key: number]: boolean;
  }>({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (listData.keywords.length > 0) {
      const tags = listData.keywords.filter((keyword) => keyword !== 1);
      const tagList = tags.map((tag) => {
        return TREATMENT_LIST.find((treatment) => treatment.keywordId === tag)
          ?.name;
      });
      setTagList(tagList as string[]);
    }
  }, [listData]);

  const likeMutation = useMutation({
    mutationFn: (postId: number) => postLike(postId),

    onSuccess: (data) => {
      setLikedByCurrentUser((prev) => !prev);
      setLikeCount(data.likeCount);
      refetch();
    }
  });

  const handleImageError = (postId: number) => {
    if (!isImageError[postId]) {
      setIsImageError((prev) => ({ ...prev, [postId]: true }));
    }
  };
  const handlePostImageError = (postId: number) => {
    if (!isPostImageError[postId]) {
      setIsPostImageError((prev) => ({ ...prev, [postId]: true }));
    }
  };

  const handlePost = (postId: number) => {
    setIsLoading(true);
    router.push(`/community/post/${postId}`);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  return (
    <>
      {isLoading && <Loading />}
      <div
        className={[styles.postWrapper, styles[`${type}Type`]].join(" ")}
        onClick={() => handlePost(listData.postId)}
      >
        <div className={styles.postCard}>
          <div className={styles.tagList}>
            {tagList.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
          <div className={styles.postHeader}>
            {type !== "post" && (
              <Image
                src={
                  listData.user?.profileImageUrl &&
                  !isImageError[listData.postId]
                    ? listData.user?.profileImageUrl.startsWith("http://") ||
                      listData.user?.profileImageUrl.startsWith("https://")
                      ? `${listData.user?.profileImageUrl}`
                      : `${process.env.IMAGE_PATH}${listData.user?.profileImageUrl}`
                    : "/profile.svg"
                }
                alt="tooth"
                width={34}
                height={34}
                className={styles.profileIcon}
                loading="lazy"
                blurDataURL="/profile.svg"
                placeholder="blur"
                onError={() => handleImageError(listData.postId)}
              />
            )}
            <div className={styles.postInfo}>
              <p className={styles.postTitle}>
                {listData.title ?? "(제목 없음)"}
              </p>
              <div className={styles.postSubInfo}>
                {type !== "post" && (
                  <span className={styles.nickName}>
                    {listData.user?.username}
                  </span>
                )}
                <span className={styles.time}>
                  {formatYYYYMMDDTIME(listData.createDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.post}>
          <div className={styles.postContentWrapper}>
            <p className={styles.postContent}>
              {listData.content ?? "(내용 없음)"}
            </p>
          </div>
          <div className={styles.postImage}>
            <Image
              width={70}
              height={70}
              key={listData.postId}
              src={
                process.env.IMAGE_PATH + "/" + listData.imageUrl[0] &&
                !isPostImageError[listData.postId]
                  ? process.env.IMAGE_PATH + "/" + listData.imageUrl[0]
                  : "/image-default.png"
              }
              alt="post-image"
              className={styles.image}
              blurDataURL="/image-default.png"
              placeholder="blur"
              loading="lazy"
              onError={() => handlePostImageError(listData.postId)}
            />
          </div>
        </div>
        {type !== "comment" && (
          <div className={styles.postFooter}>
            <span className={styles.commentNumber}>
              {listData.commentCount}
            </span>
            <span
              className={[
                styles.likeNumber,
                likedByCurrentUser ? styles.selected : ""
              ].join(" ")}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                likeMutation.mutate(listData.postId);
              }}
            >
              {likeCount}
            </span>
          </div>
        )}
        {type === "comment" && (
          <div className={styles.comment}>
            <span className={styles.commentTitle}>내 댓글</span>
            <p className={styles.commentText}>
              {listData.myComment ?? "(댓글 없음)"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default MyPostCard;
