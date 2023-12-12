package me.yunyoungjun.springbootdeveloper.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.yunyoungjun.springbootdeveloper.domain.Article;

import java.time.LocalDateTime;

@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자 추가
@Getter
public class AddArticleRequest {

    private String title;
    private String content;
//    private LocalDateTime createdAt;

    // 밑에 메서드는 블로그 글을 추가할 때 저장할 엔티티로 변환되는 용도로 사용됨.
    public Article toEntity(String author) { // 생성자를 사용하여 객체 생성
        return Article.builder()
                .title(title)
                .content(content)
                .author(author)
//                .createdAt(createdAt)
                .build();
    }

}
