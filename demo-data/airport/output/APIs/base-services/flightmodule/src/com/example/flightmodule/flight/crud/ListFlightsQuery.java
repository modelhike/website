package com.example.flightmodule.flight.crud;

import static java.util.logging.Level.FINE;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Flux;
import org.springframework.stereotype.Component;
import com.example.flightmodule.flight.model.*;

@Component
public class ListFlightsQuery {

  private static final Logger LOG = LoggerFactory.getLogger(ListFlightsQuery.class);

  private final FlightRepository repository;

  @Autowired
  public ListFlightsQuery(FlightRepository repository) {
    this.repository = repository;
  }

  public Flux<Flight> run() {

    LOG.info("Will get all Flight");

    return repository.findAll();
  }

}
