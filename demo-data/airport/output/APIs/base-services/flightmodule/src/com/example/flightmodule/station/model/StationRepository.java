package com.example.flightmodule.station.model;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.Date;
import java.util.ArrayList;

@Repository
public interface StationRepository extends ReactiveMongoRepository<Station, String> {
}
