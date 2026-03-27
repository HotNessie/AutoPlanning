package com.preplan.autoplan.repository.token;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.token.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByMember(Member member);
    void deleteByMember(Member member);
}
