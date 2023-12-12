package me.yunyoungjun.springbootdeveloper.repository;

import me.yunyoungjun.springbootdeveloper.domain.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Article, Long> {
}
