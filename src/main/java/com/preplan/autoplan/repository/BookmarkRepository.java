package com.preplan.autoplan.repository;

import com.preplan.autoplan.domain.member.Bookmark;
import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.planPlace.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

  boolean existsByPlanAndMember(Plan plan, Member member);

  Optional<Bookmark> findByPlanAndMember(Plan plan, Member member);

  List<Bookmark> findByMember(Member member);
}