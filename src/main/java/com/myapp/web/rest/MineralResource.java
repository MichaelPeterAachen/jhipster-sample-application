package com.myapp.web.rest;

import com.myapp.domain.Mineral;
import com.myapp.repository.MineralRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.Mineral}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MineralResource {

    private final Logger log = LoggerFactory.getLogger(MineralResource.class);

    private static final String ENTITY_NAME = "mineral";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MineralRepository mineralRepository;

    public MineralResource(MineralRepository mineralRepository) {
        this.mineralRepository = mineralRepository;
    }

    /**
     * {@code POST  /minerals} : Create a new mineral.
     *
     * @param mineral the mineral to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mineral, or with status {@code 400 (Bad Request)} if the mineral has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/minerals")
    public ResponseEntity<Mineral> createMineral(@RequestBody Mineral mineral) throws URISyntaxException {
        log.debug("REST request to save Mineral : {}", mineral);
        if (mineral.getId() != null) {
            throw new BadRequestAlertException("A new mineral cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mineral result = mineralRepository.save(mineral);
        return ResponseEntity
            .created(new URI("/api/minerals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /minerals/:id} : Updates an existing mineral.
     *
     * @param id the id of the mineral to save.
     * @param mineral the mineral to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mineral,
     * or with status {@code 400 (Bad Request)} if the mineral is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mineral couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/minerals/{id}")
    public ResponseEntity<Mineral> updateMineral(@PathVariable(value = "id", required = false) final Long id, @RequestBody Mineral mineral)
        throws URISyntaxException {
        log.debug("REST request to update Mineral : {}, {}", id, mineral);
        if (mineral.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mineral.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mineralRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mineral result = mineralRepository.save(mineral);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mineral.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /minerals/:id} : Partial updates given fields of an existing mineral, field will ignore if it is null
     *
     * @param id the id of the mineral to save.
     * @param mineral the mineral to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mineral,
     * or with status {@code 400 (Bad Request)} if the mineral is not valid,
     * or with status {@code 404 (Not Found)} if the mineral is not found,
     * or with status {@code 500 (Internal Server Error)} if the mineral couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/minerals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mineral> partialUpdateMineral(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Mineral mineral
    ) throws URISyntaxException {
        log.debug("REST request to partial update Mineral partially : {}, {}", id, mineral);
        if (mineral.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mineral.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mineralRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mineral> result = mineralRepository
            .findById(mineral.getId())
            .map(existingMineral -> {
                if (mineral.getName() != null) {
                    existingMineral.setName(mineral.getName());
                }

                return existingMineral;
            })
            .map(mineralRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mineral.getId().toString())
        );
    }

    /**
     * {@code GET  /minerals} : get all the minerals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of minerals in body.
     */
    @GetMapping("/minerals")
    public List<Mineral> getAllMinerals() {
        log.debug("REST request to get all Minerals");
        return mineralRepository.findAll();
    }

    /**
     * {@code GET  /minerals/:id} : get the "id" mineral.
     *
     * @param id the id of the mineral to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mineral, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/minerals/{id}")
    public ResponseEntity<Mineral> getMineral(@PathVariable Long id) {
        log.debug("REST request to get Mineral : {}", id);
        Optional<Mineral> mineral = mineralRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mineral);
    }

    /**
     * {@code DELETE  /minerals/:id} : delete the "id" mineral.
     *
     * @param id the id of the mineral to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/minerals/{id}")
    public ResponseEntity<Void> deleteMineral(@PathVariable Long id) {
        log.debug("REST request to delete Mineral : {}", id);
        mineralRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
