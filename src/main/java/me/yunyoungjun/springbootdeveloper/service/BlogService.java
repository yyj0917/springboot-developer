package me.yunyoungjun.springbootdeveloper.service;

import lombok.RequiredArgsConstructor;
import me.yunyoungjun.springbootdeveloper.domain.Article;
import me.yunyoungjun.springbootdeveloper.dto.AddArticleRequest;
import me.yunyoungjun.springbootdeveloper.dto.UpdateArticleRequest;
import me.yunyoungjun.springbootdeveloper.repository.BlogRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor // final이 붙거나 @NotNull이 붙은 필드의 생성자 추가.
@Service // 빈으로 등록
public class BlogService {

    private final BlogRepository blogRepository;

    // 블로그 글 추가 메서드
    public Article save(AddArticleRequest request, String userName) {
//        System.out.println(request.getCreatedAt());
        return blogRepository.save(request.toEntity(userName));
    }

    // 데이터베이스에 저장되어 있는 글을 모두 가져오는 메서드
    public List<Article> findAll() {
        return blogRepository.findAll();
    }
    // id 찾는 메서드
    public Article findById(long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + id));
    }
    // 삭제 메서드
    public void delete(long id) {
        Article article = blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));

        authorizeArticleAuthor(article);
        blogRepository.delete(article);
    }

    // 수정 메서드
    @Transactional
    public Article update(long id, UpdateArticleRequest request) {
        Article article = blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + id));

        authorizeArticleAuthor(article);
        article.update(request.getTitle(), request.getContent());

        return article;
    }

    // 게시글을 작성한 유저인지 확인
    private static void authorizeArticleAuthor(Article article) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!article.getAuthor().equals(userName)) {
            throw new IllegalArgumentException("not authorized");
        }
    }
}
