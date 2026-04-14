package com.example.flightmodule.flight.crud;

import static java.util.logging.Level.FINE;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Component;
import com.example.flightmodule.flight.model.*;

@Component
public class GetFlightByIdQuery {

  private static final Logger LOG = LoggerFactory.getLogger(GetFlightByIdQuery.class);

  private final FlightRepository repository;

  @Autowired
  public GetFlightByIdQuery(FlightRepository repository) {
    this.repository = repository;
  }

  public Mono<Flight> run(String id) {

    LOG.info("Will get Flight info for id={}", id);

    return repository.findById(id)
      .map(e -> e);
  }

}
