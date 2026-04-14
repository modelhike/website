package com.example.flightmodule.station.crud;

import static java.util.logging.Level.FINE;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Flux;
import org.springframework.stereotype.Component;
import com.example.flightmodule.station.model.*;

@Component
public class ListStationsQuery {

  private static final Logger LOG = LoggerFactory.getLogger(ListStationsQuery.class);

  private final StationRepository repository;

  @Autowired
  public ListStationsQuery(StationRepository repository) {
    this.repository = repository;
  }

  public Flux<Station> run() {

    LOG.info("Will get all Station");

    return repository.findAll();
  }

}
