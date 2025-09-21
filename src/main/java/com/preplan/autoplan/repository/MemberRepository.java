package com.preplan.autoplan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.preplan.autoplan.domain.member.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

  Optional<Member> findByEmail(String email);

  Optional<Member> findByName(String name);

  Optional<Member> findByPhoneNumber(String phoneNumber);

  void deleteByEmail(String email);

}
