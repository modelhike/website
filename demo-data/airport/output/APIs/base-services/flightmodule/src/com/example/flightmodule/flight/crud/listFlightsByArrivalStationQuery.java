package com.example.flightmodule.flight.crud;

import static java.util.logging.Level.FINE;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.ArrayList;
import com.example.flightmodule.flight.model.*;
@Component
public class listFlightsByArrivalStationQuery {
  private static final Logger LOG = LoggerFactory.getLogger(listFlightsByArrivalStationQuery.class);

  private final FlightRepository repository;

  @Autowired
  public listFlightsByArrivalStationQuery(FlightRepository repository) {
    this.repository = repository;
  }

    public Flux<Flight> run(Reference arrivalStation) {
        Flux<Flight> returnValue =  repository.findByArrivalStation(arrivalStation);
        Mono<Long> totalCount = returnValue.count();
        totalCount.subscribe((count -> System.out.println("Number of OR flights: " + count)));
        return returnValue;
    }
}
