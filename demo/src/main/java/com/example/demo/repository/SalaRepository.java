package com.example.demo.repository;

import com.example.demo.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaRepository extends JpaRepository<Sala, Long>{
    boolean existsByTagsId(Long tagId);//verifica se alguma sala tem uma tag com o ID
    List<Sala> findByCampus(String campus);
}
